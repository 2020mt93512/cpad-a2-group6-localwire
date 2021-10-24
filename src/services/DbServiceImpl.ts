// import firestoreService from "./FirestoreService";
import realtimeDbService from "./RealtimeDbService";
import type { DbService } from "./types";

// testing with realtime db
const dbServiceImpl: DbService = realtimeDbService;

export default dbServiceImpl;