import React, {useEffect, useState} from "react";
import './styles.css'
import logoImage from '../../assets/logo.svg'
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from '../../services/api';
export default function NewBook(){

    const [id, setId] = useState(null);
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [lauchDate, setLauchDate] = useState('');
    const [price, setPrice] = useState('');

    const {bookId} = useParams();

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const authorizathion = {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        if (bookId && bookId !== '0') {
             loadBook();
        }
    }, [bookId]); 

    async function loadBook(){
        try{
            const response = await api.get(`api/book/v1/${bookId}`, authorizathion)
            let adjustedDate = response.data.lauchDate.split("T", 10)[0];
            setId(response.data.id);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setPrice(response.data.price);
            setLauchDate(adjustedDate);
        }catch(error){
            alert('Error recovering book');
        }
    }

    async function saveOrUpdate(e){
        e.preventDefault();

        const data = { title, author, lauchDate, price };       

        try{
            if(bookId === '0')
            {
                await api.post('api/book/v1', data, authorizathion);
            }                
            else
            {
                data.id = id;
                await api.put('api/book/v1', data, authorizathion);
            }

            navigate('/books');
        }catch(error){
            alert('Error while recording book. Try again!');
        }

    }

    return (
        <div className="new-book-container">
            <div className="content">
                <section className="form">
                    <img src={logoImage} alt="Ricardo" />
                    <h1>{bookId === '0'? 'Add': 'Update'} Book</h1>
                    <p>Enter the book information</p>
                    <Link className="back-link" to="/books">
                        <FiArrowLeft size={16} color="#251fc5" />
                        Back to Books
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input placeholder="Title" value={title} onChange={e=> setTitle(e.target.value)}/>
                    <input placeholder="Author" value={author} onChange={e=> setAuthor(e.target.value)}/>
                    <input type="date" value={lauchDate} onChange={e=> setLauchDate(e.target.value)}/>
                    <input placeholder="Price" value={price} onChange={e=> setPrice(e.target.value)}/>

                    <button className="button" type="submit">{bookId === '0'? 'Add': 'Update'}</button>
                </form>
            </div>
        </div>
    );
}