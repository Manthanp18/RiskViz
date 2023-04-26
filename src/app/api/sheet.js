import { google } from "googleapis";
import keys from "../keys.json";

export async function fetchSpreadsheetData() {
    try {
        const client = new google.auth.JWT(
            keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(async function (err, tokens) {
            if (err) {
                return res.status(400).send(JSON.stringify({ error: true }));
            }

            const gsapi = google.sheets({ version: 'v4', auth: client });

            //CUSTOMIZATION FROM HERE
            const opt = {
                spreadsheetId: '1yRrbB9b7lppeHhLe6DS8mRb7IikNpM0ujk7Xxj6Gqng',
                range: 'sample_data!A1:A'
            };

            let data = await gsapi.spreadsheets.values.get(opt);
            return ({ error: false, data: data.data.values });
        });
    } catch (e) {
        return ({ error: true, message: e.message });
    }
}