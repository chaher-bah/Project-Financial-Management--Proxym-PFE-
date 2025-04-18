import React,{useEffect} from 'react';
import keycloak from '../../config/keycloak';
import { useKeycloak } from '@react-keycloak/web';
const Dash = () => {

    const { keycloak1, initialized } = useKeycloak();    
       


    if (!initialized) return <div>Loading…</div>;
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    console.log(roles)
    if (!keycloak.authenticated) {
        return (
          <div>
            <h2>You’re not logged in</h2>
            <button onClick={() => keycloak.login()}>Log in</button>
          </div>
        );
      }
    // const { userInfo, logout, loading } = useAuthContext();

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (!userInfo) {
    //     return <div>No user information available</div>;
    // }

    // // Determine highest role priority
    // const roleHierarchy = ['Admin', 'Manager', 'Pmo', 'Pm', 'new'];
    // let highestRole = 'User';
    
    // if (userInfo.roles) {
    //     for (const role of roleHierarchy) {
    //         if (userInfo.roles.includes(role)) {
    //             highestRole = role;
    //             break;
    //         }
    //     }
    // }

    return (
        <div className="dashboard-container">
            <h1>Welcome to Proxym Dashboard</h1>
            
            <div className="user-info-box">
                <h2>User Information</h2>
                <ul>
        {roles.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
                {/* <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p> */}
                {/* <p><strong>Email:</strong> {userInfo.email}</p>
                <p className="user-role">
                    <strong>Your Role:</strong> <span className="role-badge">{highestRole}</span>
                </p>
                
                {userInfo.roles && userInfo.roles.length > 0 && (
                    <div className="all-roles">
                        <p><strong>All Assigned Roles:</strong></p>
                        <ul>
                            {userInfo.roles.map(role => (
                                <li key={role}>{role}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <button onClick={logout} className="logout-btn">Logout</button> */}
            </div>
        </div>
    );
};

export default Dash;