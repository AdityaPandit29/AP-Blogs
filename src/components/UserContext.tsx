// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// interface Post {
//     id: string;
//     title: string;
//     description?: string; // ? means optional
//     content: string;
//     updated_at: string;
// }
// interface UserType {
//     username?: string;
//     nickname?: string;
//     avatarUrl?: string;
//     posts?: Post[];
// }

// interface UserContextType {
//   user: UserType | null;
//   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
// }

// const defaultContextValue: UserContextType = {
//   user: null,
//   setUser: () => {}, // noop function
// };

// const UserContext = createContext<UserContextType>(defaultContextValue);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const res = await fetch('http://localhost:3000/api/profile', { credentials: 'include' });
//         if (res.ok) {
//           const data = await res.json();
//           setUser(data);
//         }
//       } catch (err) {
//         console.error('Error fetching profile', err);
//       }
//     }
//     fetchProfile();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export const useUser = () => useContext(UserContext);
