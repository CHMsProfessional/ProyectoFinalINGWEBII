export const getGeneroForDisplay = (genero) => {
    const generoInt = parseInt(genero);
    if (generoInt === 1) {
        return 'Masculino';
    } else if (generoInt === -1) {
        return 'Femenino';
    } else {
        return 'Indefinido';
    }
}