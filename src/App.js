import logo from './logo.svg';
import './App.css';
import { Form } from 'semantic-ui-react';
import UserCard from './components/UserCard';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import UserLayout from './components/UserLayout';
import Pagination from './components/pagination';
import { paginate } from "./utils/paginate";
import { getUsers } from './services/usersService';

function App() {

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState('')
  const [repositoryName, setRepositoryName] = useState('');
  const [repositoryOwner, setRepositoryOwner] = useState('')
  const [users, setUsers] =useState([]);
  const [paginatedUsers, setPaginatedUsers] =useState([]);

  const handlePageChange = page => {
    console.log("clicked page: ",page);
    //1) Setting the currentPage value
    setCurrentPage(page);

    //paginating again
     const paginatedUsers =  paginate(users, page, pageSize);   
     setTotalCount(users.length);
     setPaginatedUsers(paginatedUsers);  

  }

  const handleSearch = (value) => {
    
    if(value.includes('/'))
    {
      const values = value.split('/');
      if(values && values.length > 0){
        setRepositoryOwner(values[0])
        setRepositoryName(values[1])
      }
    } else if (value.includes('*')) {

      const values = value.split('*');

      if(values && values.length > 0){       
        setRepositoryName(values[1])
      }
    } else {
    setRepositoryOwner("")
    setRepositoryName(value)
   }
  }

  const handleSubmit = async () => {       
        
        if(repositoryOwner && repositoryName) {
          const {data:users, status} = await getUsers(repositoryOwner,repositoryName)
          // console.log('fetched users:',users);
          // console.log('fetched status:',status);
       
           //set the error if any!
          if(status != 200){
            setError("Error during fetch of users");
            setUsers([]);
            setPaginatedUsers([]);
            setTotalCount(0);  
          } else {
            setError('');
             // Paginate the data
            
            const paginatedUsers = paginate(users, 1, pageSize);   
            console.log('users:',users);    
            console.log('paginatedUsers:',paginatedUsers); 
            setUsers(users);
            setTotalCount(users.length);
            setPaginatedUsers(paginatedUsers);  
          }     
        } else if (!repositoryOwner){
          console.log("couldn't find repository owner!");
          setError("couldn't find repository owner!");
          setUsers([]);
          setPaginatedUsers([]);
          setTotalCount(0);  
          setCurrentPage(1);  
        }else if (!repositoryName){
          console.log("couldn't find repository name!");
          setError("couldn't find repository name!");
          setUsers([]);
          setPaginatedUsers([]);
          setTotalCount(0);
          setCurrentPage(1);  
        }

     

  }

  return (
    
    <div>
     <div className='navbar'>
      Github Search repository's contributors
     </div>
     <SearchBox onChange={handleSearch} onSubmit={handleSubmit} />   

     {( error || paginatedUsers.length === 0) ?( <h1>No user found! {error}</h1>  ) : (             
        // users.map(user => <UserCard key={user.id} user={user} />)    
      
        paginatedUsers.map(user => <UserLayout key={user.id} user={user} />)     
      
              
     )} 
       <Pagination 
        itemsCount={totalCount}
        pageSize={pageSize} 
        currentPage={currentPage}
        onPageChange={handlePageChange}/>
    </div>
  )
}

export default App;
