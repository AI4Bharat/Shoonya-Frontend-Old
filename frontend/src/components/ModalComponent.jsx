import React from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';

const ModalComponent = ({isOpenModal, setIsOpenModal,title, children}) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

  const handleOk = () => {
    // setIsModalVisible(false);
    setIsOpenModal(false);
  };

  const handleCancel = () => {
    // setIsModalVisible(false);
    setIsOpenModal(false);
  };

  if(!isOpenModal) return null;

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal title={title} visible={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
       {children}
       {/* <h1>Hello</h1> */}
      </Modal>
    </>
  );
};

ModalComponent.propTypes = {
    isOpenModal: PropTypes.bool,
    setIsOpenModal: PropTypes.func,
    children : PropTypes.element,
    title : PropTypes.string,
}

export default ModalComponent;