// instrumentation.js
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const ssm = new SSMClient({ region: 'eu-west-2' });
            const command = new GetParameterCommand({
                Name: `/amplify/shared/${process.env.APP_ID}/CLERK_SECRET_KEY`,
                WithDecryption: true, // Needed if the parameter is a SecureString
            });

            const response = await ssm.send(command);
            if (response.Parameter?.Value) {
                process.env.CLERK_SECRET_KEY = response.Parameter.Value;
                console.log('Successfully fetched CLERK_SECRET_KEY from Parameter Store');
            }
        } catch (error) {
            console.error('Failed to fetch secret from Parameter Store:', error);
        }
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        try {
            const ssm = new SSMClient({ region: 'eu-west-2' });
            const command = new GetParameterCommand({
                Name: `/amplify/shared/${process.env.APP_ID}/CLERK_SECRET_KEY`,
                WithDecryption: true, // Needed if the parameter is a SecureString
            });

            const response = await ssm.send(command);
            if (response.Parameter?.Value) {
                process.env.CLERK_SECRET_KEY = response.Parameter.Value;
                console.log('Successfully fetched CLERK_SECRET_KEY from Parameter Store');
            }
        } catch (error) {
            console.error('Failed to fetch secret from Parameter Store:', error);
        }
    }
}
