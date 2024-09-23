// Define a generic type for the SOAP response
interface SoapResponse<T> {
  toString: () => string;
  data: T; // The actual response data, of generic type T
}
