import instance from "./axiosService"
import { Typecitation } from "../../types/Typecitation";

export class CitationService {
    static create = async (params: Typecitation) => {
        return await instance.post<Typecitation>("citations/", params)
    }

    static getALL = async () => {
        return await instance.get<Typecitation[]>("citations/")
    }

    static getById = async (id: number) => {
        return await instance.get<Typecitation>(`citations/${id}/`)
    }

    static update = async (id: number, params: Typecitation) => {
        return await instance.put<Typecitation>(`citations/${id}/`, params)
    }

    static delete = async (id: number) => {
        return await instance.delete<void>(`citations/${id}/`)
    }
}

export default CitationService;
