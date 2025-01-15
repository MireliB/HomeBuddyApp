import  {useEffect, useState} from 'react'

export default function UserProfile(userId) {
    const [profile, setProfile] = useState();
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState();

    useEffect(()=>{
        if(!userId){
            setErrorMsg("User ID is required!");
            setLoading(false);
            return;
        }

        const fetchProfile= async()=>{
            setLoading(true);
            setErrorMsg(null);
        }
    },[])
    
            const updateProfile = async(updatedDate)=>{
                setLoading(true); 
                setErrorMsg(null);
    
                // need to add here api request for _id (exist in compass mongodb)
            }

  return {
    profile, loading, errorMsg, updateProfile
  }
}
