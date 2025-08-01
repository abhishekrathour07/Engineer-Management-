const response= (response,stateCode,message,data=null)=>{
    const responseObject={
        status:stateCode <400 ? "success" :"error",
        message,
        data,
    }
    return response.status(stateCode).json(responseObject)
}
export default response