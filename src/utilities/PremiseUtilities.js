export const getTipoForDisplay = (tipo) => {
    switch (tipo) {
        case "0":
            return "Casa";
        case "1":
            return "Departamento";
        case "2":
            return "Cabaña";
        case "3":
            return "Loft";
        case "4":
            return "Hostal";
        case "5":
            return "Hotel";
        case "6":
            return "Otro";
    }
}