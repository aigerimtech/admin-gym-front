'use client';
import React, {useEffect, useState} from 'react';
import {useAdminStore, User} from "../../stores/admin/adminStore";


type InputWithUserNameProps = {
    selectedPersons?: (users:User[]) => void
}

const InputWithUserName = ({selectedPersons}: InputWithUserNameProps) => {
    const fetchUsersByName = useAdminStore(state => state.fetchUsersByName)

    const [name, setName] = useState('');
    const [debouncedName, setDebouncedName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

    const handleSelectUser = (user: User) => {
        setName('')
        setSelectedUsers(old => [...old, user])
    }

    useEffect(() => {
        // Устанавливаем таймер на 300ms для обновления debouncedName
        const timer = setTimeout(() => {
            setDebouncedName(name);
        }, 500);

        // Очищаем таймер при следующем вызове useEffect
        return () => clearTimeout(timer);
    }, [name]);

    useEffect(() => {
        // Выполняем запрос только когда debouncedName обновляется
        if (debouncedName) {
            const fetchUsers = async () => {
                try {
                    const data = await fetchUsersByName(debouncedName); // Ожидаем завершения асинхронной операции
                    if (data) {
                        setSearchedUsers(data); // Устанавливаем данные в состояние
                    }
                } catch (error) {
                    console.error("Failed to fetch courses:", error);
                    setSearchedUsers([]); // Обрабатываем ошибку, например, сбрасываем состояние
                }
            };
            fetchUsers();
        }
    }, [debouncedName, fetchUsersByName]);

    useEffect(() => {
        if(selectedPersons){
            selectedPersons(selectedUsers)
        }
    }, [selectedUsers]);

    return (
        <div className="relative mb-2">
            {selectedUsers[0] && (
                <div className={'flex flex-wrap gap-2 items-center mb-3'}>
                    {selectedUsers.map(user => (
                        <div key={user.id}
                             onClick={() => setSelectedUsers(old => old.filter(userOld => user.id !== userOld.id))}
                             className={'px-4 py-2 rounded-lg bg-gray-400 bg-opacity-10 text-black hover:text-white hover:bg-gray-500 transition-colors cursor-pointer shadow-sm'}>
                            <p className={'text-sm '}>{user.first_name} {user.last_name}</p>
                        </div>

                    ))}
                </div>
            )}
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
            />
            <div
                className="absolute left-0 top-[110%] bg-white overflow-y-scroll max-h-[160px] w-full shadow-2xl z-9999">
                {debouncedName && searchedUsers.map((user) => (
                    <div
                        key={user.id}
                        className="w-full flex items-center justify-between py-3 px-2 hover:bg-primary hover:bg-opacity-10 cursor-pointer"
                        onClick={() => handleSelectUser(user)}
                    >
                        <p className="font-semibold text-base text-black">{user.first_name} {user.last_name}</p>
                        <div className="rounded-2xl px-4 py-2 bg-warning">
                            <span className="text-sm text-white">{user?.role ? user.role : 'null'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputWithUserName;
