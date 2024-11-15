import React, { useState, useEffect } from "react";
import { Button, ErrorBlock } from "antd-mobile";
const ErrorBoundary = ({ children }: any) => {
	const [hasError, setHasError] = useState(false);
	const [, setError] = useState(null);

	const handleError = (error: React.SetStateAction<null>) => {
		if (error) {
			setHasError(true);
			setError(error);
		}
	};

	// Simulate componentDidCatch and getDerivedStateFromError
	useEffect(() => {
		const errorHandler = (event: any) => {
			handleError(event.error);
			event.preventDefault();
		};

		window.addEventListener("error", errorHandler);
		window.addEventListener("unhandledrejection", errorHandler);

		return () => {
			window.removeEventListener("error", errorHandler);
			window.removeEventListener("unhandledrejection", errorHandler);
		};
	}, []);

	if (hasError) {
		return (
			<div className='flex items-center justify-center flex-col gap-5'>
				<ErrorBlock fullPage description='刷新试试' />
				<Button onClick={() => window.location.reload()} color='primary'>
					重新加载
				</Button>
			</div>
		);
	}

	return children;
};

export default ErrorBoundary;
