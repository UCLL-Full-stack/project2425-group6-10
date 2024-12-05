import { Group } from '../../model/group';

test('given: valid values, when: creating a new group, then: group is created', () => {
    const group = new Group({
        id: 1,
        name: 'Group 1',
        description: 'Group 1 description',
    });

    expect(group.getId()).toBe(1);
    expect(group.getName()).toBe('Group 1');
    expect(group.getDescription()).toBe('Group 1 description');
    expect(group.getCode()).toBeDefined();
});

test('given: empty name, when: creating a new group, then: an error is thrown', () => {
    const group = () => {
        new Group({
            id: 1,
            name: '',
            description: 'Group 1 description',
        });
    };

    expect(group).toThrow('Name is required');
});

test('given: only spaces in name, when: creating a new group, then: an error is thrown', () => {
    const group = () => {
        new Group({
            id: 1,
            name: '       ',
            description: 'Group 1 description',
        });
    };

    expect(group).toThrow('Name is required');
});

test('given: empty description, when: creating a new group, then: an error is thrown', () => {
    const group = () => {
        new Group({
            id: 1,
            name: 'Group 1',
            description: '',
        });
    };

    expect(group).toThrow('Description is required');
});

test('given: only spaces in description, when: creating a new group, then: an error is thrown', () => {
    const group = () => {
        new Group({
            id: 1,
            name: 'Group 1',
            description: '       ',
        });
    };

    expect(group).toThrow('Description is required');
});
