import { Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../api/OrganizationAPI";
import { addUsersToWorkspace } from "../../api/WorkspaceAPI";
import { memberColumns } from "./TableColumns";

export function MembersTab({ workspaceMembers, orgId, workspaceId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const addNewUsers = async () => {
      console.log(selectedUsers.join());
    await addUsersToWorkspace(workspaceId, selectedUsers).then((done) => {
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
      if (Array.isArray(workspaceMembers) && workspaceMembers.length !== 0) {
        displayUsers = displayUsers.filter(
          (displayUser) =>
            workspaceMembers.findIndex(
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
      >
        Invite new members to workspace
      </Button>
      <Modal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => addNewUsers()}
      >
        <Title level={5}>Enter emails to be invited</Title>
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
      <Table columns={memberColumns} dataSource={workspaceMembers} />
    </>
  );
}

MembersTab.propTypes = {
  workspaceMembers: PropTypes.array,
  orgId: PropTypes.number,
  workspaceId: PropTypes.number,
};
