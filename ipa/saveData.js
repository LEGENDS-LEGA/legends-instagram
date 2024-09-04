import fs from 'fs';
import path from 'path';

const dataFilePath = path.resolve('./data.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        let jsonData = [];

        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath);
            jsonData = JSON.parse(fileData);
        }

        jsonData.push({ login: username, password });

        fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));

        res.status(200).json({ message: 'Data successfully saved!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
}
