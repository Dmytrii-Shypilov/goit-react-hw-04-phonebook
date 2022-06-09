import style from './phonebook-app.module.css';

import { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';

import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';

const PhonebookApp = () => {
  const [contacts, setContacts] = useState([
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  ]);

  const [filter, setFilter] = useState('');

  const firstRender = useRef(true);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('contacts'));
    if (firstRender.current) {
      if (storedData.length) {
        setContacts(storedData);
      }
      firstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const addContact = useCallback(
    newData => {
      console.log(newData);
      const { name, number } = newData;
      if (
        contacts.find(
          contact => contact.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        return alert(`${name} is already added!`);
      }

      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      setContacts(prevContacts => [...prevContacts, newContact]);
    },
    [contacts]
  );

  const deleteContact = id => {
    setContacts(prevContacts => prevContacts.filter(item => item.id !== id));
  };

  const filterChange = ({ target }) => {
    setFilter(target.value);
  };

  const getFilteredContactsList = useCallback(() => {
    if (!filter) {
      return contacts;
    }
    const filterQuery = filter.toLowerCase();
    const filteredItems = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filterQuery)
    );
    return filteredItems;
  }, [filter, contacts]);

  const filteredContacts = getFilteredContactsList();
  return (
    <div className={style.bookSection}>
      <h1 className={style.title}>Phonebook</h1>
      <ContactForm onSubmit={addContact} />

      <h2 className={style.title}>Contacts</h2>
      <Filter filterChange={filterChange} />
      <ContactList contacts={filteredContacts} deleteContact={deleteContact} />
    </div>
  );
};

export default PhonebookApp;
