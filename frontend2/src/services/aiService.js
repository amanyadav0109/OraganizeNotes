import api from "./api";

export const generateAI = async(action,text)=>{

    const res = await api.post("/ai/generate",{

        action,

        text

    });

    return res.data.output;

}