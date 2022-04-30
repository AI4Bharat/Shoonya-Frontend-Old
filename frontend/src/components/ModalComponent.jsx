import React from "react";
import { 
    Modal, 
    // Button 
} from "antd";
import PropTypes from "prop-types";

const ModalComponent = ({
  isOpenModal,
  setIsOpenModal,
  title,
  formSubmit,
  children,
}) => {
  const handleOk = () => {
    formSubmit();
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  if (!isOpenModal) return null;

  return (
    <>
      <Modal
        title={title}
        visible={isOpenModal}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

ModalComponent.propTypes = {
  isOpenModal: PropTypes.bool,
  setIsOpenModal: PropTypes.func,
  children: PropTypes.element,
  title: PropTypes.string,
  formSubmit: PropTypes.func,
};

export default ModalComponent;
