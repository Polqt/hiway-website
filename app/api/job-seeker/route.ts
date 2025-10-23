import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();

		// Get the current user
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const job_seeker_id = searchParams.get("job_seeker_id");

		if (!job_seeker_id) {
			return NextResponse.json(
				{ error: "Job seeker ID is required" },
				{ status: 400 },
			);
		}

		// Get job seeker profile
		const { data: jobSeeker, error } = await supabase
			.from("job_seeker")
			.select(`
        job_seeker_id,
        auth_user_id,
        role,
        full_name,
        email,
        phone,
        address,
        skills,
        experience,
        education,
        licenses_certifications,
        search_document,
        pinecone_id,
        embedding_checksum,
        created_at,
        updated_at
      `)
			.eq("job_seeker_id", job_seeker_id)
			.single();

		if (error) {
			console.error("Error fetching job seeker:", error);
			return NextResponse.json(
				{ error: "Failed to fetch job seeker profile" },
				{ status: 500 },
			);
		}

		if (!jobSeeker) {
			return NextResponse.json(
				{ error: "Job seeker not found" },
				{ status: 404 },
			);
		}

		// Transform the data to match frontend expectations
		const transformedJobSeeker = {
			job_seeker_id: jobSeeker.job_seeker_id,
			full_name: jobSeeker.full_name,
			email: jobSeeker.email,
			phone: jobSeeker.phone,
			address: jobSeeker.address,
			skills: Array.isArray(jobSeeker.skills) ? jobSeeker.skills : [],
			experience: Array.isArray(jobSeeker.experience)
				? jobSeeker.experience
				: [],
			education: Array.isArray(jobSeeker.education) ? jobSeeker.education : [],
			licenses_certifications: Array.isArray(jobSeeker.licenses_certifications)
				? jobSeeker.licenses_certifications
				: [],
			created_at: jobSeeker.created_at,
			updated_at: jobSeeker.updated_at,
		};

		return NextResponse.json({ jobSeeker: transformedJobSeeker });
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const supabase = await createClient();
		const body = await request.json();

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { job_seeker_id, ...updateData } = body;

		if (!job_seeker_id) {
			return NextResponse.json(
				{ error: "Job seeker ID is required" },
				{ status: 400 },
			);
		}

		// Update job seeker profile
		const { data, error } = await supabase
			.from("job_seeker")
			.update({
				...updateData,
				updated_at: new Date().toISOString(),
			})
			.eq("job_seeker_id", job_seeker_id)
			.eq("auth_user_id", user.id) // Ensure user can only update their own profile
			.select()
			.single();

		if (error) {
			console.error("Error updating job seeker:", error);
			return NextResponse.json(
				{ error: "Failed to update job seeker profile" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, jobSeeker: data });
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
