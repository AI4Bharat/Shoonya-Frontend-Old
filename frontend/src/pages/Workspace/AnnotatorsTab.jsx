import { Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../api/OrganizationAPI";
import { addAnnotatorsToWorkspace } from "../../api/WorkspaceAPI";
import { getMemberColumns, memberColumns } from "./TableColumns";

export function AnnotatorsTab({ workspaceAnnotators, orgId, workspaceId, isArchived }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const addNewUsers = async () => {
    console.log(selectedUsers.join());
    await addAnnotatorsToWorkspace(workspaceId, selectedUsers).then((done) => {
      if (done) {
        setSelectedUsers([]);
        setModalOpen(false);
        location.reload();
      }
    });
  };

  useEffect(() => {
    const populateAvailableUsers = async () => {
      const users = await fetchUsers(orgId);
      if (!users || !Array.isArray(users) || users.length === 0) {
        return;
      }

      let displayUsers = users;

      // filter out users which are already present in workspace
      if (
        Array.isArray(workspaceAnnotators) &&
        workspaceAnnotators.length !== 0
      ) {
        displayUsers = displayUsers.filter(
          (displayUser) =>
            workspaceAnnotators.findIndex(
              (workspaceUser) => displayUser.id === workspaceUser.id
            ) === -1
        );
      }

      setAvailableUsers(displayUsers);
    };

    populateAvailableUsers();
  }, [setAvailableUsers, setSelectedUsers]);

  const handleSelectChange = (userIds) => {
    setSelectedUsers(userIds);
  };

  return (
    <>
      <Button
        style={{ width: "100%", marginBottom: "1%" }}
        onClick={() => setModalOpen(true)}
        type="primary"
        disabled={isArchived}
      >
        Add Annotators to Workspace
      </Button>
      <Modal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => addNewUsers()}
        okButtonProps={{ disabled: selectedUsers.length === 0 }}
      >
        <Title level={5}>Enter Usernames to be added</Title>
        <Select
          mode="multiple"
          allowClear
          bordered
          placeholder="Select users to add"
          options={availableUsers.map((user) => ({
            label: user.username,
            value: user.id,
          }))}
          style={{ width: "100%", marginTop: "5%" }}
          onChange={handleSelectChange}
        />
      </Modal>
      <Table columns={getMemberColumns(workspaceId, isArchived)} dataSource={workspaceAnnotators} />
    </>
  );
}

AnnotatorsTab.propTypes = {
  workspaceAnnotators: PropTypes.array,
  orgId: PropTypes.number,
  workspaceId: PropTypes.number,
  isArchived: PropTypes.bool
};
