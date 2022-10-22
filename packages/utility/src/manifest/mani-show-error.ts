import color from 'picocolors';

export function showError(error: any) {
    console.log(color.red('tm-error:\n'), error);
}
