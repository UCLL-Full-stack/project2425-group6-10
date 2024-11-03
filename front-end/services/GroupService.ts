const getAllGroups = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/groups', {
        method: 'GET',
        headers: {
            'content-type': 'application/json'}
    })
}

const LecturerService = {
    getAllGroups,
}

export default LecturerService;