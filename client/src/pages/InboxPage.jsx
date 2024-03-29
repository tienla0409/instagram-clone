import {
  HeaderContainer,
  HelmetContainer,
  MessageContainer,
  SidebarContainer,
} from "../containers";
import { useEffect, useState } from "react";
import { Inbox, Spinner } from "../components";
import { Route, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

const InboxPage = () => {
  const socketConnect = useSelector((state) => state.socketConnect);
  const { socket } = socketConnect;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { path } = useRouteMatch();

  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [numberUnreadMessage, setNumberUnreadMessage] = useState(0);

  useEffect(() => {
    socket.emit("client-get-all-conversation");

    socket.on("server-send-conversation-error", () => {
      setError("Not found");
    });

    socket.on("server-sending-all-conversation", () => {
      setIsLoading(true);
    });

    socket.on("server-send-new-conversation", (data) => {
      const { conversation, creator } = data;
      if (
        (conversations.find((c) => c._id !== conversation._id) ||
          conversations.length === 0) &&
        creator !== userInfo._id
      ) {
        setConversations((conversations) => [...conversations, conversation]);
      }
      socket.emit("client-get-number-unread-message");
    });

    socket.on("server-send-all-conversation", (conversationList) => {
      setConversations(conversationList);
      setIsLoading(false);
    });

    socket.on("server-send-number-unread-message", (num) => {
      setNumberUnreadMessage(num);
    });

    return () => {
      socket.off("server-send-conversation-error");
      socket.off("server-sending-all-conversation");
      socket.off("server-send-new-conversation");
      socket.off("server-send-all-conversation");
      socket.off("server-send-number-unread-message");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <HelmetContainer
        title={
          numberUnreadMessage > 0
            ? `(${numberUnreadMessage}) Inbox • Chats`
            : "Inbox • Chats"
        }
      />
      <HeaderContainer relative="true" inbox="true" />
      {error ? (
        <Inbox.Error>{error}</Inbox.Error>
      ) : isLoading ? (
        <Spinner size="lg" color="black" />
      ) : (
        <Inbox>
          <Route
            path={[`${path}/:conversationId`, `${path}`]}
            render={(props) => (
              <>
                <SidebarContainer {...props} conversations={conversations} />
                <MessageContainer {...props} />
              </>
            )}
          />
        </Inbox>
      )}
    </>
  );
};

export default InboxPage;
