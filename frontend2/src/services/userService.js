import api from "./api";

export const getPublicProfile = async(id)=>{

    const res=await api.get(`/user/public/${id}`);

    return res.data;

}
export const updateName = async (name) => {

    const res = await api.put("/user/name", {

        name

    });

    return res.data;

};