export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]
}

// JIKA MESSAGE LENGTH LEBIH DARI 
export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 && // SELAMA KURANG DARI INDEX TERAKHIR
        (messages[i + 1].sender._id !== m.sender._id || //SENDER ID MESAGES TIDAK SAMA DENGAN SENDER MESSAGE SEKARANG ATAU TIDAK UNDIFINED
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId // DAN MESAGES SENDER ID INDEX KE I TIDAK SAMA DENGAN USER ID
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 && // JIKA INDEX SAMA DENGAN INDEX MESSAGE TERAKHIR
        messages[messages.length - 1].sender._id !== userId && // DAN MESAGE SENDER ID TIDAK SAMA DENGAN USER ID
        messages[messages.length - 1].sender._id // DAN MESAGES SENDER TERAKHIR ADA 
    );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 && // SELAMA KURANG DARI INDEX TERAKHIR
        messages[i + 1].sender._id === m.sender._id && // DAN MESAGES ID BERIKUTNYA SAMA DENGAN MESAGE SEKARANG SENDER ID
        messages[i].sender._id !== userId // DAN IDNYA TIDAK SAMA DENGAN USER
    )
        return 33;
    else if (
        (i < messages.length - 1 && // JIKA MESAGES LENGHT KURANG DARI INDEX TERAKHIR
            messages[i + 1].sender._id !== m.sender._id && // DAN MESAGES SENDER ID BERIKUTNYA TIDAK SAMA MESAGES SEKARANG SENDER ID
            messages[i].sender._id !== userId) || // DAN MESSAGES SENDER ID TIDAK SAMA DENGAN SENDER ID
        (i === messages.length - 1 && messages[i].sender._id !== userId) // MESAGES LENGHT KURANG DARI INDEX TERAKHIR DAN MESAGES SENDER ID SEKARANG TIDAK SAMA DENGAN USER ID
    )
        return 0;
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id; // JIKA I KURANG DARI LEBIH DARI 0 DAN MESAGES INDEX SEBELUMNYA SAMA DENGAN ID MESAGES SEKARANG 
};