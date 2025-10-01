// secret-loader.mjs
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

async function setSSMSecrets() {
    // Skip SSM if AWS_APP_ID is not set (local development)
    if (!process.env.AWS_APP_ID) {
        console.log('AWS_APP_ID not set, skipping SSM secret loading (using local .env)');
        return;
    }

    console.log(`Loading secrets for AWS_APP_ID: ${process.env.AWS_APP_ID}`);

    const ssmClient = new SSMClient({ region: 'eu-west-2' });

    const command = new GetParameterCommand({
        Name: `/amplify/shared/${process.env.AWS_APP_ID}/CLERK_SECRET_KEY`,
        WithDecryption: true,
    });

    try {
        const response = await ssmClient.send(command);
        if (response.Parameter?.Value) {
            process.env.CLERK_SECRET_KEY = response.Parameter.Value;
            console.log('Successfully loaded SSM secrets at runtime.');
            console.log('CLERK_SECRET_KEY is now set:', !!process.env.CLERK_SECRET_KEY);
        } else {
            console.log("No environment value");
        }
    } catch (error) {
        console.warn('Could not fetch SSM secrets, falling back to local environment:', error.message);
    }
}

await setSSMSecrets();
