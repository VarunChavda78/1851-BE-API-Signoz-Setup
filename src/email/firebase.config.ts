import * as admin from 'firebase-admin';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';

let firebaseApp: admin.app.App;

export async function initializeFirebaseApp(config: EnvironmentConfigService) {
  if (!firebaseApp) {
    const url = `${config.getAwsS3Url()}/static/gcp-auth.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const serviceAccount = await response.json();

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
  return firebaseApp;
}

export function getFirebaseApp() {
  if (!firebaseApp) {
    throw new Error('Firebase app not initialized');
  }
  return firebaseApp;
}
