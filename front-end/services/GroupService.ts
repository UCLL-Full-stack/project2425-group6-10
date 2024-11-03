const getAllGroups = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/groups', {
        method: 'GET',
        headers: {
            'content-type': 'application/json'}
    })
}

const getUsersByGroup = async (code: string) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/groups/' + code + '/users', {
        method: 'GET',
        headers: {
            'content-type': 'application/json'}
    })
}

const LecturerService = {
    getAllGroups,
    getUsersByGroup,
}

export default LecturerService;