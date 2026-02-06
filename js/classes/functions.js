class Functions{
    static percent_text_color = (percent) => {
        switch (true) {
            case percent > (100 * 6/7): return "text-green-500"; break;
            case percent > (100 * 5/7): return "text-lime-500"; break;
            case percent > (100 * 4/7): return "text-yellow-500"; break;
            case percent > (100 * 3/7): return "text-amber-500"; break;
            case percent > (100 * 2/7): return "text-orange-500"; break;
            case percent > (100 * 1/7): return "text-red-500"; break;
            default: return "text-red-600";
        }
    }
}