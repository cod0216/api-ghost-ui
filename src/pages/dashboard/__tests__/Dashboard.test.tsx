import { render, screen } from '@testing-library/react';
import Dashboard from '@/pages/dashboard/Dashboard';
import React from 'react';
import userEvent from '@testing-library/user-event';

const getSidebarItem = (fileName: string) => screen.getByTestId(`sidebar-item-${fileName}`);
const getHeaderTab = (fileName: string) => screen.getByTestId(`header-tab-${fileName}`);
const getCloseButton = (fileName: string) => screen.getByTestId(`close-button-${fileName}`);

const FILE_NAME_1 = 'user-scenario-result-01';
const FILE_NAME_2 = 'user-scenario-result-02';

const mockOnItemSelected = jest.fn();

jest.mock('@/pages/dashboard/hooks/useTabsController.ts', () => {
  const actual = jest.requireActual('@/pages/dashboard/hooks/useTabsController.ts');

  return {
    __esModule: true,
    useTabsController: (params: any) => {
      const real = actual.useTabsController({
        ...params,
        onItemSelected: mockOnItemSelected,
      });
      return real;
    },
  };
});

describe('Dashboard interaction tests', () => {
  beforeEach(() => {
    mockOnItemSelected.mockClear();
    render(<Dashboard />);
  });

  test('adds selected class when a scenario item is selected', async () => {
    const item = getSidebarItem(FILE_NAME_1);
    await userEvent.click(item);
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('adds tab when sidebar item is clicked', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    expect(getHeaderTab(FILE_NAME_1)).toBeInTheDocument();
  });

  test('selects existing tab if already opened', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('selecting tab in HeaderTabs updates selected sidebar item', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getSidebarItem(FILE_NAME_2));
    await userEvent.click(getHeaderTab(FILE_NAME_1));
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('reselecting same tab does not change state', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    const tab = getHeaderTab(FILE_NAME_1);
    await userEvent.click(tab);
    expect(getHeaderTab(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('closes tab from HeaderTabs', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getCloseButton(FILE_NAME_1));
    expect(screen.queryByTestId(`header-tab-${FILE_NAME_1}`)).toBeNull();
  });

  test('closing selected tab selects first tab', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getSidebarItem(FILE_NAME_2));
    await userEvent.click(getCloseButton(FILE_NAME_2));
    expect(getHeaderTab(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('called onItemSelected by clicking sidebar item ', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    expect(mockOnItemSelected).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: FILE_NAME_1 }),
    );
  });
});
