import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import { getPublicProfile } from "../services/userService";

function PublicProfile(){

    const {id}=useParams();

    const [user,setUser]=useState(null);

    useEffect(()=>{

        load();

    },[]);

    const load=async()=>{

        try{

            const data=await getPublicProfile(id);

            setUser(data);

        }

        catch(err){

            console.log(err);

        }

    }

    if(!user){

        return <h1 className="text-center mt-20">Loading...</h1>

    }

    return(

        <div className="min-h-screen flex justify-center items-center bg-slate-100 dark:bg-slate-900">

            <div className="card w-[450px] text-center p-10">

                <Avatar
                    name={user.name}
                    size={120}
                />

                <h1 className="text-4xl font-bold mt-6">

                    {user.name}

                </h1>

                <p className="text-gray-500 mt-4">

                    📚 This user uses StudyHub.

                </p>

            </div>

        </div>

    )

}

export default PublicProfile;