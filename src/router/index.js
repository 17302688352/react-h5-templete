import { createBrowserRouter } from "react-router-dom";
import createRoutes from "./routes";

export async function setupRouter() {
	const routes = await createRoutes();
	const router = createBrowserRouter(routes);
	return router;
}
