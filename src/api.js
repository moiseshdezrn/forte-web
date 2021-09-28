
const url = 'https://localhost:44365'

const getPermisosAll = async () => {
    const requestURL = `${url}/api/permiso/all`
    const headers = {
    }
    const request = await fetch( requestURL, headers )
    
    if(!request.ok || request.status !== 200) 
        throw 'Error al obtener respuesta del servidor: ' + request.status
    return await request.json()
}

const getTipoPermisoAll = async () => {
    const requestURL = `${url}/api/tipopermiso/all`
    const request = await fetch( requestURL )
    if(!request.ok || request.status !== 200) 
        throw 'Error al obtener respuesta del servidor: ' + request.status
    return await request.json()
}

const updatePermiso = async (permiso) => {
    const requestURL = `${url}/api/permiso/update`
    
        
    const request = await fetch( requestURL, {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        dataType: 'json',
        method: 'put',
        body: JSON.stringify(permiso)
    })
    if(!request.ok || request.status !== 200) 
        throw 'Error al obtener respuesta del servidor: ' + request.status
    return true
    
}

const createPermiso = async function(permiso){
    const requestURL = `${url}/api/permiso/new`
    
        
    const request = await fetch( requestURL, {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        dataType: 'json',
        method: 'post',
        body: JSON.stringify(permiso)
    })
    if(!request.ok || request.status !== 200) 
        throw 'Error al obtener respuesta del servidor: ' + request.status
    return true
}

const deletePermiso= async function(permiso){
    const requestURL = `${url}/api/permiso/delete`
    
        
    const request = await fetch( requestURL, {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        dataType: 'json',
        method: 'delete',
        body: JSON.stringify(permiso)
    })
    if(!request.ok || request.status !== 200) 
        throw 'Error al obtener respuesta del servidor: ' + request.status
    return true
}

export default{
    getPermisosAll,
    getTipoPermisoAll,
    
    updatePermiso,
    createPermiso,
    deletePermiso
}