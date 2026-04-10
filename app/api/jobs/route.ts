import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all jobs
export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: { appliedDate: "desc" },
  });
  return NextResponse.json(jobs);
}

// POST new job
export async function POST(req: Request) {
  const body = await req.json();

  const job = await prisma.job.create({
    data: {
      company: body.company,
      title: body.title,
      status: body.status,
      notes: body.notes,
      link: body.link,
    },
  });

  return NextResponse.json(job);
}

// DELETE job
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.job.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}