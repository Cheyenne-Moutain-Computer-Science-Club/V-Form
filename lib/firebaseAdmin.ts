import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: applicationDefault(),
		// databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
	});
}

export { admin };