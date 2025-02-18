import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 特定の部員情報を取得
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const member = await prisma.member.findUnique({ where: { id: params.id } });

        if (!member) {
            return NextResponse.json({ error: '部員が見つかりません' }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch {
        return NextResponse.json({ error: '部員情報の取得に失敗しました' }, { status: 500 });
    }
}

// PUT: 特定の部員情報を更新
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updatedMember = await prisma.member.update({
            where: { id: params.id },
            data: body
        });

        return NextResponse.json(updatedMember);
    } catch {
        return NextResponse.json({ error: '部員情報の更新に失敗しました' }, { status: 500 });
    }
}

// DELETE: 特定の部員を削除
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.member.delete({ where: { id: params.id } });
        return NextResponse.json({ message: '部員情報を削除しました' });
    } catch {
        return NextResponse.json({ error: '部員情報の削除に失敗しました' }, { status: 500 });
    }
}
