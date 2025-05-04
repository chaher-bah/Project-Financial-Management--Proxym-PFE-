
export const checkUserAccess = (userRoles) => {
  const ROLEHIERARCHY = "Admin,PMO,Pm,Manager,new,Tester";
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];

    const validRoles = (ROLEHIERARCHY || '').split(',').map(r => r.trim()).filter(Boolean);
    const hasValidRole = roles.some(role => 
      validRoles.includes(role) && role !== 'new'
    );
    
    // Redirect only if user has EXACTLY ['new'] and no other roles
    return !(roles.length === 1 && roles[0] === 'new') && hasValidRole;
  };