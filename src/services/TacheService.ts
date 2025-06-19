import instance from "./axiosService"

type taches = {
    titre:string
    description:string
    etat:string
    jour:string
}
type tachesWithId = taches & {id:number}

export class tacheService{

     static create = async(params:taches) => {
        return await instance.post<taches & {id:number}>("taches/",params)
    }

    static getALL = async()=>{
        return await instance.get<tachesWithId[]>("taches/") //il retourne un objet contenant une liste d'attributs et pour afficher le résultat de la requête on utilise "data"
    }

    static getById = async(id:number) => {
        return await instance.get<tachesWithId>(`taches/${id}/`)
    }

    static update = async(id:number,params:taches) => {
        return await instance.put<tachesWithId>(`taches/${id}/`,params)
    }
    
    static delete = async(id:number) => {
        return await instance.delete<tachesWithId>(`taches/${id}/`)
    }

}