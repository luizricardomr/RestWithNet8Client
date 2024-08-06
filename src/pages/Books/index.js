import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiPower, FiEdit, FiTrash2 } from "react-icons/fi";
import logoImage from '../../assets/logo.svg';

import api from '../../services/api';

import './styles.css'

export default function Books(){    
    const [books, setBooks] = useState([]);
    const [page, setPages] = useState(0);


    const userName = localStorage.getItem('userName');
    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    const navigate = useNavigate();
    
    useEffect(() => {
        fetchMoreBooks();
    }, [accessToken]);

    async function fetchMoreBooks() {
        try {
            const response = await api.get(`/api/Book/v1/asc/4/${page}`, authorization);
            setBooks([...books, ...response.data.list]);
            setPages(page + 1);
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Failed to fetch books. Please try again.');
        }
    }

    async function editBook(id){
        try{
            navigate(`/book/new/${id}`);
        }catch(error){
            alert('Edit book faild. Try Again!');
        }
    }

    async function deleteBook(id){
        try{

          await api.delete(`api/book/v1/${id}`, authorization);

            setBooks(books.filter(book => book.id !== id));

        }catch(error){
            alert('Delete faild. Try Again!');
        }
    }

    async function logout(){
        try{

          await api.get('api/auth/v1/revoke', authorization);
            localStorage.clear();
            navigate('/');
        }catch(error){
            alert('logout faild. Try Again!');
        }
    }

    return (
        <div className="book-container">
            <header>
                <img src={logoImage} alt="Ricardo" />
                <span>Welcome, <strong>{userName.toUpperCase()}</strong>!</span>
                <Link className="button" to="/book/new/0" replace>Add New Book</Link>
                <button onClick={logout} type="button">
                    <FiPower size={18} color="#211fc5" />
                </button>
            </header>

            <h1>Registered Books</h1>
            <ul>
              {books.map(book => (
                                <li key={book.id}>
                                <strong>Title:</strong>
                                <p>{book.title}</p>
                                <strong>Author:</strong>
                                <p>{book.author}</p>
                                <strong>Price:</strong>
                                <p>{Intl.NumberFormat('pt-BR',{style: 'currency', currency: 'BRL'}).format(book.price)}</p>
                                <strong>Release Date:</strong>
                                <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.lauchDate))}</p>
            
                                <button onClick={() => editBook(book.id)} type="button">
                                    <FiEdit size={20} color="#251fC5" />
                                </button>
                                <button onClick={() => deleteBook(book.id)} type="button">
                                    <FiTrash2 size={20} color="#251fC5" />
                                </button>
                            </li>  
              ))}
            </ul>
            <button className="button" onClick={fetchMoreBooks} type="button">Load More</button>
        </div>
    );
}