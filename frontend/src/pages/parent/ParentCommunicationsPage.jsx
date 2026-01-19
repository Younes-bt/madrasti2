```javascript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ParentCommunicationsPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/parent/messages', { replace: true });
  }, [navigate]);

  return null;
};

export default ParentCommunicationsPage;
```
