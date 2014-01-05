package chat

type Message struct {
	Author string `json:"author"`
	Body   string `json:"body"`
	User   string `json:"user"`
}

func (self *Message) String() string {
	return self.Author + " says " + self.Body
}
