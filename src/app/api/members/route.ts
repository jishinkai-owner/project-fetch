import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 部員情報を取得
        try {
            const members = await prisma.member.findMany();
            return res.status(200).json(members);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: '部員情報の取得に失敗しました' });
        }
    }

    if (req.method === 'POST') {
        // 部員を新規作成
        const { name, roles, major, nickname, profile } = req.body;

        try {
            const newMember = await prisma.member.create({
                data: { name, roles, major, nickname, profile },
            });
            return res.status(201).json(newMember);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: '部員情報の登録に失敗しました' });
        }
    }

    return res.status(405).json({ error: 'このメソッドは許可されていません' });
}
