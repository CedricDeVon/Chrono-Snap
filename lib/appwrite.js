import { Client, Databases, Account } from "react-native-appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("679f44fb00273c269e36")
  .setPlatform('com.example.idea-tracker');


export const account = new Account(client);
export const databases = new Databases(client);
