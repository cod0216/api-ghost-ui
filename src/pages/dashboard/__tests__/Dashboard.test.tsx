import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/pages/dashboard/Dashboard';
import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  getScenarioResultList,
  getScenarioDetailResult,
} from '@/pages/dashboard/service/resultService.ts';
import {
  mockScenarioTestDetailResponse,
  mockScenarioTestResultFileList,
} from '@/pages/dashboard/__mocks__/mockHistoryList.ts';

const getSidebarItem = (fileName: string) => screen.getByTestId(`sidebar-item-${fileName}`);
const getHeaderTab = (fileName: string) => screen.getByTestId(`header-tab-${fileName}`);
const getCloseButton = (fileName: string) => screen.getByTestId(`close-button-${fileName}`);

const FILE_NAME_1 = 'user-scenario-result-01';
const FILE_NAME_2 = 'user-scenario-result-02';

jest.mock('@/pages/dashboard/service/resultService.ts');

describe('Dashboard interaction tests (with mock service)', () => {
  beforeEach(async () => {
    (getScenarioResultList as jest.Mock).mockResolvedValue(mockScenarioTestResultFileList);
    (getScenarioDetailResult as jest.Mock).mockResolvedValue(mockScenarioTestDetailResponse);

    render(<Dashboard />);

    await waitFor(() => {
      expect(getSidebarItem(FILE_NAME_1)).toBeInTheDocument();
    });
  });

  test('renders scenario list on initial load', () => {
    expect(getSidebarItem(FILE_NAME_1)).toBeInTheDocument();
    expect(getSidebarItem(FILE_NAME_2)).toBeInTheDocument();
  });

  test('clicking sidebar item fetches detail and opens tab', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    expect(getScenarioDetailResult).toHaveBeenCalledWith(FILE_NAME_1);
    expect(getHeaderTab(FILE_NAME_1)).toBeInTheDocument();
  });

  test('adds selected class when a scenario item is selected', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('clicking same item again does not open duplicate tab', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    const tabs = screen.getAllByTestId(new RegExp(`^header-tab-${FILE_NAME_1}`));
    expect(tabs).toHaveLength(1);
  });

  test('selecting tab in HeaderTabs updates selected sidebar item', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getSidebarItem(FILE_NAME_2));
    await userEvent.click(getHeaderTab(FILE_NAME_1));
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('reselecting same tab does not change state', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getHeaderTab(FILE_NAME_1));
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });

  test('closes tab from HeaderTabs', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getCloseButton(FILE_NAME_1));
    expect(screen.queryByTestId(`header-tab-${FILE_NAME_1}`)).not.toBeInTheDocument();
  });

  test('closing selected tab selects first tab if exists', async () => {
    await userEvent.click(getSidebarItem(FILE_NAME_1));
    await userEvent.click(getSidebarItem(FILE_NAME_2));
    await userEvent.click(getCloseButton(FILE_NAME_2));
    expect(getSidebarItem(FILE_NAME_1)).toHaveAttribute('data-selected', 'true');
  });
});
