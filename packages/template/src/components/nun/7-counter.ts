export function setupCounter(element: HTMLButtonElement) {
    let counter = 0;
    function setCounter(count: number) {
        counter = count;
        element.innerHTML = `count is ${counter}`;
    }
    
    element.addEventListener('click', () => setCounter(++counter));
    setCounter(0);
}
