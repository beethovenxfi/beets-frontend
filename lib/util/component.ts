export function getSelectedProps(isSelected = false) {
    if (isSelected) {
        return { 'data-selected': true };
    }
    return {};
}
