export class ResponseData<Template>{
    responseData: Data<Template>;
    statusCode: number;
    message: string;

    constructor(responseData: Data<Template>, statusCode: number, message: string) {
        this.responseData = responseData;
        this.statusCode = statusCode;
        this.message = message;
        return this;
    }
}

export class Data<Template> {
    data: Template | Template[];
    itemsPerPage?: number;
    currentPage?: number;

    constructor(data: Template | Template[], itemsPerPage?: number, currentPage?: number) {
        this.data = data;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = currentPage;
        return this;
    }
}
