import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const instance = axios.create({
	baseURL: 'http://www.nomase.uat.nerdiness.ca',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/soap+xml',
	},
});

// Request Interceptor (unchanged)
instance.interceptors.request.use(
	(config) => {
		if (config.headers['Content-Type'] === 'application/soap+xml') {
			console.log('SOAP Request:', config.data);
		}
		return config;
	},
	(error) => {
		console.error('Request Error:', error);
		return Promise.reject(error);
	}
);

// Response Interceptor
instance.interceptors.response.use(
	async (response) => {
		if (
			response.config.headers['Content-Type'] ===
			'application/soap+xml; charset=utf-8'
		) {
			try {
				const parser = new XMLParser();
				const result = parser.parse(response.data);

				// Check for SOAP fault
				const soapBody = result['soap:Envelope']['soap:Body'];

				if (soapBody['soap:Fault']) {
					const fault = soapBody['soap:Fault'];

					throw new Error(`SOAP Fault: ${fault['soap:Reason']['soap:Text']}`);
				}

				// Extract the response body (assuming it's the first child of soap:Body)
				const responseBodyKey = Object.keys(soapBody).find(
					(key) => key !== 'soap:Fault'
				);

				if (!responseBodyKey) {
					throw new Error('Unable to find response body');
				}

				const responseBody = soapBody[responseBodyKey];

				// Check for application-level errors (adjust according to your API's error structure)
				if (responseBody.oraresp && responseBody.oraresp.errors) {
					throw new Error(`Application Error: ${responseBody.oraresp.errmsg}`);
				}

				// Replace the XML string with the parsed and processed result
				response.data = {
					success: true,
					data: responseBody,
				};
			} catch (error: any) {
				console.log(error);
				response.data = {
					success: false,
					error: error.message,
				};
			}
		}

		return response;
	},
	(error) => {
		console.error('Response Error:', error);

		return Promise.reject({
			success: false,
			error: error.message,
		});
	}
);

// Helper function to create SOAP envelope (unchanged)
const createSoapEnvelope = (body: string) =>
	`<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body>${body}</soap:Body></soap:Envelope>`;

// Function to make SOAP requests (unchanged)
const soapRequest = async (endpoint: string, body: string) => {
	const response = await instance.post(endpoint, createSoapEnvelope(body), {
		headers: {
			'Content-Type': 'application/soap+xml; charset=utf-8',
		},
	});

	return response.data;
};

export { soapRequest };
