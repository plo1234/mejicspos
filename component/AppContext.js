import React,{useState} from 'react'

const UserContext = React.createContext()

export const UserProvider = ({ children }) => {
  const [name, setName] = useState(0);
  //const [location, setLocation] = useState("Mars");

  return (
    <UserContext.Provider
      value={{
        name,
        //location,
        setName,
        //setLocation
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext